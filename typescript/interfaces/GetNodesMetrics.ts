export interface GetNodesMetrics {
    apiVersion: string;
    items: Item[];
    kind: string;
    metadata: GetNodesMetricsMetadata;
}

export interface Item {
    apiVersion: string;
    kind: string;
    metadata: ItemMetadata;
    spec: Spec;
    status: StatusClass;
}

export interface ItemMetadata {
    annotations: Annotations;
    creationTimestamp: Date;
    labels: Labels;
    name: string;
    resourceVersion: string;
    uid: string;
}

export interface Annotations {
    "alpha.kubernetes.io/provided-node-ip": string;
    "csi.volume.kubernetes.io/nodeid": string;
    "network.cilium.io/ipv4-cilium-host": string;
    "network.cilium.io/ipv4-health-ip": string;
    "network.cilium.io/ipv4-pod-cidr": string;
    "node.alpha.kubernetes.io/ttl": string;
    "volumes.kubernetes.io/controller-managed-attach-detach": string;
}

export interface Labels {
    "beta.kubernetes.io/arch": string;
    "beta.kubernetes.io/instance-type": string;
    "beta.kubernetes.io/os": string;
    "doks.digitalocean.com/managed": string;
    "doks.digitalocean.com/node-id": string;
    "doks.digitalocean.com/node-pool": string;
    "doks.digitalocean.com/node-pool-id": string;
    "doks.digitalocean.com/version": string;
    "failure-domain.beta.kubernetes.io/region": string;
    "kubernetes.io/arch": string;
    "kubernetes.io/hostname": string;
    "kubernetes.io/os": string;
    "node.kubernetes.io/instance-type": string;
    region: string;
    "topology.kubernetes.io/region": string;
}

export interface Spec {
    providerID: string;
}

export interface StatusClass {
    addresses: Address[];
    allocatable: Allocatable;
    capacity: Allocatable;
    conditions: Condition[];
    daemonEndpoints: DaemonEndpoints;
    images: Image[];
    nodeInfo: NodeInfo;
    volumesAttached?: VolumesAttached[];
    volumesInUse?: string[];
}

export interface Address {
    address: string;
    type: Type;
}

export enum Type {
    ExternalIP = "ExternalIP",
    Hostname = "Hostname",
    InternalIP = "InternalIP",
}

export interface Allocatable {
    cpu: string;
    "ephemeral-storage": string;
    "hugepages-2Mi": string;
    memory: string;
    pods: string;
}

export interface Condition {
    lastHeartbeatTime: Date;
    lastTransitionTime: Date;
    message: string;
    reason: string;
    status: StatusEnum;
    type: string;
}

export enum StatusEnum {
    False = "False",
    True = "True",
}

export interface DaemonEndpoints {
    kubeletEndpoint: KubeletEndpoint;
}

export interface KubeletEndpoint {
    Port: number;
}

export interface Image {
    names: string[];
    sizeBytes: number;
}

export interface NodeInfo {
    architecture: string;
    bootID: string;
    containerRuntimeVersion: string;
    kernelVersion: string;
    kubeProxyVersion: string;
    kubeletVersion: string;
    machineID: string;
    operatingSystem: string;
    osImage: string;
    systemUUID: string;
}

export interface VolumesAttached {
    devicePath: string;
    name: string;
}

export interface GetNodesMetricsMetadata {
    resourceVersion: string;
}
