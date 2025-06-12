export interface GetPodsMetrics {
    apiVersion: GetPodsMetricsAPIVersion;
    items: GetPodsMetricsItem[];
    kind: string;
    metadata: GetPodsMetricsMetadata;
}

export enum GetPodsMetricsAPIVersion {
    V1 = "v1",
}

export interface GetPodsMetricsItem {
    apiVersion: GetPodsMetricsAPIVersion;
    kind: ItemKind;
    metadata: ItemMetadata;
    spec: Spec;
    status: StatusClass;
}

export enum ItemKind {
    Pod = "Pod",
}

export interface ItemMetadata {
    creationTimestamp: Date;
    generateName: string;
    labels: Labels;
    name: string;
    namespace: NamespaceEnum;
    ownerReferences: OwnerReference[];
    resourceVersion: string;
    uid: string;
    annotations?: Annotations;
    finalizers?: string[];
}

export interface Annotations {
    "kubectl.kubernetes.io/restartedAt"?: Date;
    "prometheus.io/path"?: string;
    "prometheus.io/port"?: string;
    "prometheus.io/scrape"?: string;
    "checksum/configuration"?: string;
    "checksum/config"?: string;
    "checksum/secret"?: string;
    "checksum/configmap"?: string;
    "checksum/health"?: string;
    "checksum/scripts"?: string;
}

export interface Labels {
    app?: string;
    "pod-template-hash"?: string;
    "app.kubernetes.io/component"?: string;
    "app.kubernetes.io/instance"?: string;
    "app.kubernetes.io/managed-by"?: AppKubernetesIoManagedBy;
    "app.kubernetes.io/name"?: string;
    "app.kubernetes.io/version"?: string;
    "helm.sh/chart"?: string;
    "batch.kubernetes.io/controller-uid"?: string;
    "batch.kubernetes.io/job-name"?: string;
    "controller-uid"?: string;
    "job-name"?: string;
    "app.kubernetes.io/part-of"?: string;
    "apps.kubernetes.io/pod-index"?: string;
    "controller-revision-hash"?: string;
    "statefulset.kubernetes.io/pod-name"?: string;
}

export enum AppKubernetesIoManagedBy {
    Helm = "Helm",
}

export enum NamespaceEnum {
    Hcode = "hcode",
    N8NConfig = "n8n-config",
    N8NSecret = "n8n-secret",
    RabbitmqConfig = "rabbitmq-config",
    VideoUploadSecrets = "video-upload-secrets",
}

export interface OwnerReference {
    apiVersion: OwnerReferenceAPIVersion;
    blockOwnerDeletion: boolean;
    controller: boolean;
    kind: OwnerReferenceKind;
    name: string;
    uid: string;
}

export enum OwnerReferenceAPIVersion {
    AppsV1 = "apps/v1",
    BatchV1 = "batch/v1",
}

export enum OwnerReferenceKind {
    Job = "Job",
    ReplicaSet = "ReplicaSet",
    StatefulSet = "StatefulSet",
}

export interface Spec {
    affinity?: Affinity;
    containers: Container[];
    dnsPolicy: DNSPolicy;
    enableServiceLinks: boolean;
    imagePullSecrets?: ImagePullSecret[];
    nodeName: NodeName;
    preemptionPolicy: PreemptionPolicy;
    priority: number;
    restartPolicy: RestartPolicy;
    schedulerName: SchedulerName;
    securityContext: SpecSecurityContext;
    serviceAccount: string;
    serviceAccountName: string;
    terminationGracePeriodSeconds: number;
    tolerations: Toleration[];
    volumes: Volume[];
    nodeSelector?: NodeSelector;
    automountServiceAccountToken?: boolean;
    hostname?: string;
    initContainers?: InitContainer[];
    subdomain?: string;
}

export interface Affinity {
    podAntiAffinity: PodAntiAffinity;
}

export interface PodAntiAffinity {
    preferredDuringSchedulingIgnoredDuringExecution: PreferredDuringSchedulingIgnoredDuringExecution[];
}

export interface PreferredDuringSchedulingIgnoredDuringExecution {
    podAffinityTerm: PodAffinityTerm;
    weight: number;
}

export interface PodAffinityTerm {
    labelSelector: LabelSelector;
    topologyKey: TopologyKey;
}

export interface LabelSelector {
    matchExpressions?: MatchExpression[];
    matchLabels?: MatchLabels;
}

export interface MatchExpression {
    key: MatchExpressionKey;
    operator: MatchExpressionOperator;
    values: string[];
}

export enum MatchExpressionKey {
    App = "app",
}

export enum MatchExpressionOperator {
    In = "In",
}

export interface MatchLabels {
    "app.kubernetes.io/instance": string;
    "app.kubernetes.io/name": string;
    "app.kubernetes.io/component"?: AppKubernetesIoComponent;
}

export enum AppKubernetesIoComponent {
    Master = "master",
    Primary = "primary",
    Replica = "replica",
}

export enum TopologyKey {
    KubernetesIoHostname = "kubernetes.io/hostname",
}

export interface Container {
    image: string;
    imagePullPolicy: Policy;
    name: string;
    ports?: PortElement[];
    resources: Resources;
    terminationMessagePath: TerminationMessagePath;
    terminationMessagePolicy: TerminationMessagePolicy;
    volumeMounts: VolumeMount[];
    args?: string[];
    env?: Env[];
    livenessProbe?: Probe;
    securityContext?: ContainerSecurityContext;
    readinessProbe?: ReadinessProbe;
    lifecycle?: Lifecycle;
    startupProbe?: Probe;
    envFrom?: EnvFrom[];
    command?: Command[];
}

export enum Command {
    BinBash = "/bin/bash",
    BinSh = "/bin/sh",
    C = "-c",
}

export interface Env {
    name: string;
    valueFrom?: ValueFrom;
    value?: string;
}

export interface ValueFrom {
    fieldRef?: FieldRef;
    secretKeyRef?: SecretKeyRef;
}

export interface FieldRef {
    apiVersion: GetPodsMetricsAPIVersion;
    fieldPath: FieldPath;
}

export enum FieldPath {
    MetadataName = "metadata.name",
    MetadataNamespace = "metadata.namespace",
    StatusPodIP = "status.podIP",
}

export interface SecretKeyRef {
    key: string;
    name: string;
}

export interface EnvFrom {
    configMapRef?: ImagePullSecret;
    secretRef?: ImagePullSecret;
}

export interface ImagePullSecret {
    name: NamespaceEnum;
}

export enum Policy {
    Always = "Always",
    IfNotPresent = "IfNotPresent",
}

export interface Lifecycle {
    preStop: PreStop;
}

export interface PreStop {
    exec: Exec;
}

export interface Exec {
    command: string[];
}

export interface Probe {
    failureThreshold: number;
    httpGet?: LivenessProbeHTTPGet;
    initialDelaySeconds: number;
    periodSeconds: number;
    successThreshold: number;
    timeoutSeconds: number;
    exec?: Exec;
    tcpSocket?: TCPSocket;
}

export interface LivenessProbeHTTPGet {
    path: string;
    port: number | string;
    scheme: string;
}

export interface TCPSocket {
    port: string;
}

export interface PortElement {
    containerPort: number;
    protocol: Protocol;
    name?: string;
}

export enum Protocol {
    TCP = "TCP",
}

export interface ReadinessProbe {
    failureThreshold: number;
    httpGet?: ReadinessProbeHTTPGet;
    initialDelaySeconds: number;
    periodSeconds: number;
    successThreshold: number;
    timeoutSeconds: number;
    exec?: Exec;
}

export interface ReadinessProbeHTTPGet {
    path: string;
    port: number;
    scheme: string;
}

export interface Resources {
    limits?: Limits;
    requests?: Limits;
}

export interface Limits {
    cpu: string;
    memory: string;
    "ephemeral-storage"?: EphemeralStorage;
}

export enum EphemeralStorage {
    The2Gi = "2Gi",
    The50Mi = "50Mi",
}

export interface ContainerSecurityContext {
    allowPrivilegeEscalation?: boolean;
    capabilities?: PurpleCapabilities;
    readOnlyRootFilesystem?: boolean;
    runAsGroup?: number;
    runAsNonRoot?: boolean;
    runAsUser?: number;
    seccompProfile?: SeccompProfile;
    seLinuxOptions?: LastState;
    privileged?: boolean;
}

export interface PurpleCapabilities {
    drop: Drop[];
    add?: string[];
}

export enum Drop {
    All = "ALL",
}

export interface LastState {
}

export interface SeccompProfile {
    type: SeccompProfileType;
}

export enum SeccompProfileType {
    RuntimeDefault = "RuntimeDefault",
}

export enum TerminationMessagePath {
    DevTerminationLog = "/dev/termination-log",
}

export enum TerminationMessagePolicy {
    File = "File",
}

export interface VolumeMount {
    mountPath: string;
    name: string;
    readOnly?: boolean;
    subPath?: string;
    recursiveReadOnly?: RecursiveReadOnly;
}

export enum RecursiveReadOnly {
    Disabled = "Disabled",
}

export enum DNSPolicy {
    ClusterFirst = "ClusterFirst",
}

export interface InitContainer {
    args?: string[];
    command: string[];
    image: string;
    imagePullPolicy: Policy;
    name: string;
    resources: Resources;
    securityContext?: InitContainerSecurityContext;
    terminationMessagePath: TerminationMessagePath;
    terminationMessagePolicy: TerminationMessagePolicy;
    volumeMounts: VolumeMount[];
}

export interface InitContainerSecurityContext {
    allowPrivilegeEscalation: boolean;
    capabilities: FluffyCapabilities;
    readOnlyRootFilesystem: boolean;
    runAsGroup: number;
    runAsNonRoot: boolean;
    runAsUser: number;
    seLinuxOptions: LastState;
    seccompProfile: SeccompProfile;
}

export interface FluffyCapabilities {
    drop: Drop[];
}

export enum NodeName {
    NodeT5Fm0 = "node-t5fm0",
    NodeTwzo8 = "node-twzo8",
    NodeTymz7 = "node-tymz7",
    NodeTymzc = "node-tymzc",
}

export interface NodeSelector {
    "kubernetes.io/os": string;
}

export enum PreemptionPolicy {
    PreemptLowerPriority = "PreemptLowerPriority",
}

export enum RestartPolicy {
    Always = "Always",
    OnFailure = "OnFailure",
}

export enum SchedulerName {
    DefaultScheduler = "default-scheduler",
}

export interface SpecSecurityContext {
    runAsNonRoot?: boolean;
    seccompProfile?: SeccompProfile;
    fsGroup?: number;
    fsGroupChangePolicy?: Policy;
}

export interface Toleration {
    effect: Effect;
    key: TolerationKey;
    operator: TolerationOperator;
    tolerationSeconds: number;
}

export enum Effect {
    NoExecute = "NoExecute",
}

export enum TolerationKey {
    NodeKubernetesIoNotReady = "node.kubernetes.io/not-ready",
    NodeKubernetesIoUnreachable = "node.kubernetes.io/unreachable",
}

export enum TolerationOperator {
    Exists = "Exists",
}

export interface Volume {
    name: string;
    projected?: Projected;
    persistentVolumeClaim?: PersistentVolumeClaim;
    secret?: Secret;
    configMap?: VolumeConfigMap;
    emptyDir?: EmptyDir;
}

export interface VolumeConfigMap {
    defaultMode: number;
    name: string;
}

export interface EmptyDir {
    medium?: string;
}

export interface PersistentVolumeClaim {
    claimName: string;
}

export interface Projected {
    defaultMode: number;
    sources: Source[];
}

export interface Source {
    serviceAccountToken?: ServiceAccountToken;
    configMap?: SourceConfigMap;
    downwardAPI?: DownwardAPI;
    secret?: ImagePullSecret;
}

export interface SourceConfigMap {
    items: ConfigMapItem[];
    name: ConfigMapName;
}

export interface ConfigMapItem {
    key: PathEnum;
    path: PathEnum;
}

export enum PathEnum {
    CACRT = "ca.crt",
}

export enum ConfigMapName {
    KubeRootCACRT = "kube-root-ca.crt",
}

export interface DownwardAPI {
    items: DownwardAPIItem[];
}

export interface DownwardAPIItem {
    fieldRef: FieldRef;
    path: ItemPath;
}

export enum ItemPath {
    Namespace = "namespace",
}

export interface ServiceAccountToken {
    expirationSeconds: number;
    path: ServiceAccountTokenPath;
}

export enum ServiceAccountTokenPath {
    Token = "token",
}

export interface Secret {
    defaultMode: number;
    secretName: string;
}

export interface StatusClass {
    conditions: Condition[];
    containerStatuses: ContainerStatus[];
    hostIP: HostIP;
    hostIPs: IP[];
    phase: Phase;
    podIP?: string;
    podIPs?: IP[];
    qosClass: QosClass;
    startTime: Date;
    initContainerStatuses?: InitContainerStatus[];
}

export interface Condition {
    lastProbeTime: null;
    lastTransitionTime: Date;
    status: StatusEnum;
    type: ConditionType;
    message?: string;
    reason?: string;
}

export enum StatusEnum {
    False = "False",
    True = "True",
}

export enum ConditionType {
    ContainersReady = "ContainersReady",
    Initialized = "Initialized",
    PodReadyToStartContainers = "PodReadyToStartContainers",
    PodScheduled = "PodScheduled",
    Ready = "Ready",
}

export interface ContainerStatus {
    containerID?: string;
    image: string;
    imageID: string;
    lastState: LastStateClass;
    name: string;
    ready: boolean;
    restartCount: number;
    started: boolean;
    state: PurpleState;
    volumeMounts: VolumeMount[];
}

export interface LastStateClass {
    terminated?: Terminated;
}

export interface Terminated {
    containerID: string;
    exitCode: number;
    finishedAt: Date;
    reason: Reason;
    startedAt: Date;
}

export enum Reason {
    Completed = "Completed",
    Error = "Error",
    OOMKilled = "OOMKilled",
}

export interface PurpleState {
    running?: Running;
    waiting?: Waiting;
}

export interface Running {
    startedAt: Date;
}

export interface Waiting {
    message?: string;
    reason: string;
}

export enum HostIP {
    The10108015 = "10.108.0.15",
    The10108018 = "10.108.0.18",
    The10108019 = "10.108.0.19",
    The10108020 = "10.108.0.20",
}

export interface IP {
    ip: string;
}

export interface InitContainerStatus {
    containerID: string;
    image: string;
    imageID: string;
    lastState: LastState;
    name: string;
    ready: boolean;
    restartCount: number;
    started: boolean;
    state: LastStateClass;
    volumeMounts: VolumeMount[];
}

export enum Phase {
    Pending = "Pending",
    Running = "Running",
}

export enum QosClass {
    BestEffort = "BestEffort",
    Burstable = "Burstable",
    Guaranteed = "Guaranteed",
}

export interface GetPodsMetricsMetadata {
    resourceVersion: string;
}
